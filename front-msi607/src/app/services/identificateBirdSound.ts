export default async function identificateBirdSound(audio: File) {
  const formData = new FormData();
  formData.append("file", audio);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${apiUrl}/bird-recognition/identify`;
    console.log("endpoint", endpoint)

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar el archivo de audio:", error);
    throw error;
  }
}
