export default async function identificateBirdSound(audio: File) {
  const formData = new FormData();
  formData.append("audioFile", audio);
  try {
    const response = await fetch("/url_backend", {
      method: "POST",
      body: formData,
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar el archivo de audio");
  }
}
