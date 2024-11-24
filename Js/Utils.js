export const getProducts = async () => {
  try {
    const response = await fetch("./Data/data.json");
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
