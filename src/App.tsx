import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MouseEvent, useEffect, useRef, useState } from "react";
import fetchData from "./data/apiData";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import "./App.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";

interface RowData {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

function App() {
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [fetchedData, setFetchedData] = useState<Record<string, any> | null>();
  const [firstRowIndex, setFirstRowIndex] = useState<number>(0); // First row index for pagination
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const selectPanelRef = useRef<OverlayPanel | null>(null);
  const [inputRows, setInputRows] = useState<number | undefined>();
  const [remainingRows, setRemainingRows] = useState<number>(0);

  // fetching data from API
  const fetchDataFromApi = async (page: number) => {
    try {
      setLoading(true);

      const response = await fetchData(page);
      if (response && response.data) {
        setFetchedData(response);
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  function handleRowData(data: string) {
    return data ? data : "-";
  }

  const toggleOverlay = (e: MouseEvent<HTMLButtonElement>) => {
    selectPanelRef.current?.toggle(e);
  };

  function handleCurrentPageSelection() {
    if (!inputRows) return;

    const currentPageRows = fetchedData?.data?.slice(0, 12);
    if (inputRows <= 12) {
      setSelectedRows(currentPageRows.slice(0, inputRows));
      setRemainingRows(0);
    } else {
      setSelectedRows(currentPageRows);
      setRemainingRows(inputRows - 12);
    }
  }

  function handleNextPageSelection() {
    if (!inputRows || inputRows === 0 || inputRows <= 12) return;

    if (remainingRows > 0) {
      const nextPageRows = fetchedData?.data?.slice(0, 12);
      const selectRows = Math.min(remainingRows, nextPageRows.length);
      setSelectedRows((prevRows: any) => [
        ...prevRows,
        ...nextPageRows.slice(0, selectRows),
      ]);
      setRemainingRows(remainingRows - selectRows);
    }
  }

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchDataFromApi(currentPage);
    if (initialLoad) setInitialLoad(false);
  }, [currentPage]);

  // Handle selection of rows when page changes
  useEffect(() => {
    handleNextPageSelection();
  }, [fetchedData]);

  return (
    <div className="main">
      <div className="header">
        <h1>DataTable</h1>
      </div>

      <div className="data-table-container">
        <DataTable
          value={fetchedData?.data || []}
          selection={selectedRows}
          onSelectionChange={(e) => {
            setSelectedRows(e.value);
          }}
          dataKey="id"
          loading={initialLoad}
          tableStyle={{ minWidth: "50rem" }}
          rows={fetchedData?.pagination?.limit}
          scrollable
          scrollHeight="calc(80vh - 90px)"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "4.5rem", position: "relative" }}
            header={
              <div className="custom-selector">
                <Button
                  icon="pi pi-chevron-down"
                  rounded
                  outlined
                  aria-label="Custom Check Selection"
                  className="custom-select-dropdown"
                  onClick={(e) => toggleOverlay(e)}
                />
                <OverlayPanel ref={selectPanelRef}>
                  <input
                    type="number"
                    name="customSelect"
                    id="customSelect"
                    placeholder="enter no. of rows.."
                    className="select-input"
                    onChange={(e) => setInputRows(Number(e.target.value))}
                  />
                  <br />
                  <Button
                    icon="pi pi-check"
                    label="Select rows"
                    className="select-button"
                    onClick={(e) => {
                      handleCurrentPageSelection();
                      toggleOverlay(e);
                    }}
                  />
                </OverlayPanel>
              </div>
            }
          ></Column>
          <Column
            field="title"
            header="Title"
            body={
              loading ? (
                <Skeleton width="10rem" />
              ) : (
                (rowData) => handleRowData(rowData.title)
              )
            }
          ></Column>
          <Column
            field="place_of_origin"
            header="Place of Origin"
            body={
              loading ? (
                <Skeleton width="10rem" />
              ) : (
                (rowData) => handleRowData(rowData.place_of_origin)
              )
            }
          ></Column>
          <Column
            field="artist_display"
            header="Artist"
            body={
              loading ? (
                <Skeleton width="10rem" />
              ) : (
                (rowData) => handleRowData(rowData.artist_display)
              )
            }
          ></Column>
          <Column
            field="inscriptions"
            header="Inscriptions"
            body={
              loading ? (
                <Skeleton width="10rem" />
              ) : (
                (rowData) => handleRowData(rowData.inscriptions)
              )
            }
          ></Column>
          <Column
            field="date_start"
            header="Date Start"
            body={
              loading ? (
                <Skeleton width="10rem" />
              ) : (
                (rowData) => handleRowData(rowData.date_start)
              )
            }
          ></Column>
          <Column
            field="date_end"
            header="Date End"
            body={
              loading ? (
                <Skeleton width="10rem" />
              ) : (
                (rowData) => handleRowData(rowData.date_end)
              )
            }
          ></Column>
        </DataTable>

        <Paginator
          first={firstRowIndex}
          rows={fetchedData?.pagination?.limit}
          totalRecords={fetchedData?.pagination?.total}
          onPageChange={(e) => {
            setFirstRowIndex(e.first);
            setCurrentPage(e.page + 1);
          }}
        />
      </div>
    </div>
  );
}

export default App;
