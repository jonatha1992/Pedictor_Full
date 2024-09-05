import { useAuth } from "../context/AuthContext";

const { getUserToken, user } = useAuth(); // Obteniendo getUserToken y user desde el AuthContext

const fetchDataWithToken = async () => {
  try {
    if (user) {
      // Obtén el token de usuario
      const idToken = await getUserToken();
      console.log(idToken);
      // Realizar la solicitud GET con el token en el encabezado
      const response = await fetch("http://127.0.0.1:8000/api/v1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Enviando el token en el encabezado
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Maneja los datos de respuesta aquí
      } else {
        console.error("Error en la solicitud:", response.statusText);
      }
    } else {
      console.error("No hay un usuario autenticado");
    }
  } catch (error) {
    console.error("Error al obtener el token o hacer la solicitud:", error);
  }
};
