import { supabaseClient } from "../../utils/supabase";

export default async function getAlvearData(req, res) {
  let { data: ofertasAlvear, error } = await supabaseClient
    .from("ofertasAlvear")
    .select("*");
  console.log(ofertasAlvear, error);
  if (res.status(200)) {
    return res.json({ data: ofertasAlvear });
  }
}
