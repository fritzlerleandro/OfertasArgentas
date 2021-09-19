import { supabaseClient } from "../../utils/supabase";
import { fetchAlvear } from "../../marketScripts/alvear";

export default async function setAlvearData(req, res) {
  const listadoProductos = await fetchAlvear();

  const { data, error } = await supabaseClient
    .from("alvear")
    .insert(listadoProductos);

  if (res.status(200)) {
    return res.json({ data: data });
  }
  if (error) {
    return res.json({ error: error });
  }
}
