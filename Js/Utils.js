export const getProducts = async () => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/JSGPDev/Malva-Reply/refs/heads/main/Data/data.json");
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
