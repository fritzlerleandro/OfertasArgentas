import { supabaseClient } from "../../utils/supabase";

export default async function getAlvearData(req, res) {
  let { data: alvear, error } = await supabaseClient
    .from("alvear")
    .select("*")
    .ilike("category", "%LIMPIEZA%")
    .lte("discount_price", 200);

  // console.log(alvear, error);

  if (error) {
    return res.json({ error: error });
  }
  if (res.status(200)) {
    return res.json({ data: alvear });
  }
}
