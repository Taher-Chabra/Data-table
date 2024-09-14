export default async function fetchData(page: number) {
  const API_URL = `https://api.artic.edu/api/v1/artworks?page=${page}`;

  try {
      const response = await fetch(API_URL);

      if (!response.ok) {
         throw new Error(`error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      return jsonData;
  } catch (error) {
      console.error("Error fetching data:", error);
      return null;
  }
}
