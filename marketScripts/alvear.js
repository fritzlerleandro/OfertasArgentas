// import { createClient } from "@supabase/supabase-js";
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
const puppeteer = require("puppeteer");
//Init supabaseClient
// const supabaseClient = createClient(supabaseUrl, supabaseKey);

export async function fetchAlvear() {
  console.time("Alvear");
  let listadoProductos = [];
  let numPages = await getNumPages(
    "https://www.alvearsupermercados.com.ar/ofertas/page/1/?orderby=price"
  );
  console.log("Number of pages:", numPages);

  for (let h = 1; h <= numPages; h++) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setDefaultNavigationTimeout(0); // this avoid TimeOutError of 30k ms exceeded
    await page.setViewport({ width: 1366, height: 768 });
    let searchUrl = `https://www.alvearsupermercados.com.ar/ofertas/page/${h}/?orderby=price`;

    await page.goto(searchUrl, {
      waitUntil: "load",
      // Remove the timeout
      timeout: 0,
    });
    // await page.screenshot({ path: "screenshots/alvearOfertas.png" });

    // Cantidad de productos en la página
    let box = await page.waitForXPath(`//*[@id="main"]/div/div[2]/div/div[2]`);
    let productCount = await page.evaluate((el) => el.childElementCount, box);

    for (let i = 1; i <= productCount; i++) {
      // Nombre del producto
      let PRODUCT_NAME =
        '//*[@id="main"]/div/div[2]/div/div[2]/div[INDEX]/div/div[2]/div[2]/div[1]/p[2]/a';
      let productName = await page.waitForXPath(
        `//*[@id="main"]/div/div[2]/div/div[2]/div[${i}]/div/div[2]/div[2]/div[1]/p[2]/a`
      );
      let product = await page.evaluate((el) => el.textContent, productName);

      // Categoría de producto
      let PRODUCT_CATEGORY =
        '//*[@id="main"]/div/div[2]/div/div[2]/div[INDEX]/div/div[2]/div[2]/div[1]/p[2]/a';
      let productCat = await page.waitForXPath(
        `//*[@id="main"]/div/div[2]/div/div[2]/div[${i}]/div/div[2]/div[2]/div[1]/p[1]`
      );
      let categoryText = await page.evaluate(
        (el) => el.textContent,
        productCat
      );
      let category = categoryText.trim();

      // Link del producto
      let PRODUCT_LINK =
        '//*[@id="main"]/div/div[2]/div/div[2]/div[INDEX]/div/div[2]/div[2]/div[1]/p[2]/a';
      let productLink = await page.waitForXPath(
        `//*[@id="main"]/div/div[2]/div/div[2]/div[${i}]/div/div[2]/div[1]/div[1]/a`
      );
      let linkText = await page.evaluate(
        (el) => el.getAttribute("href"),
        productLink
      );
      let link = linkText.trim();

      //Imagen del producto
      let PRODUCT_IMAGE =
        '//*[@id="main"]/div/div[2]/div/div[2]/div[INDEX]/div/div[2]/div[2]/div[1]/p[2]/a';
      let productImage = await page.waitForXPath(
        `//*[@id="main"]/div/div[2]/div/div[2]/div[${i}]/div/div[2]/div[1]/div[1]/a/img`
      );
      let imageText = await page.evaluate(
        (el) => el.getAttribute("src"),
        productImage
      );
      let image = imageText.trim();

      // Precio de oferta del producto
      const PRODUCT_OFFER_PRICE_INT =
        '//*[@id="main"]/div/div[2]/div/div[2]/div[INDEX]/div/div[2]/div[2]/div[2]/span/ins/span';
      let discount_price = await page.waitForXPath(
        `//*[@id="main"]/div/div[2]/div/div[2]/div[${i}]/div/div[2]/div[2]/div[2]/span/ins/span`
      );
      let discountPrice = await page.evaluate(
        (el) => el.textContent,
        discount_price
      );
      let price = parseFloat(
        discountPrice.replace("$", "").substring(0, discountPrice.length - 3) +
          "." +
          discountPrice.replace("$", "").substring(discountPrice.length - 3)
      );

      // Precio regular del producto
      const PRODUCT_REGULAR_PRICE =
        '//*[@id="main"]/div/div[2]/div/div[2]/div[INDEX]/div/div[2]/div[2]/div[2]/span/ins/span';
      let regular_price = await page.waitForXPath(
        `//*[@id="main"]/div/div[2]/div/div[2]/div[${i}]/div/div[2]/div[2]/div[2]/span/del/span`
      );
      let regularPrice = await page.evaluate(
        (el) => el.textContent,
        regular_price
      );
      let normal_price = parseFloat(
        regularPrice.replace("$", "").substring(0, regularPrice.length - 3) +
          "." +
          regularPrice.replace("$", "").substring(regularPrice.length - 3)
      );

      let prod = {
        product_name: product,
        category: category,
        product_url: link,
        img_url: image,
        regular_price: normal_price,
        discount_price: price,
      };

      console.log("Product: ", prod.product_name);
      listadoProductos.push(prod);
    }
    browser.close();
  }

  console.timeEnd("Alvear");

  return listadoProductos;
}

async function getNumPages(alvearOfertasUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  const searchUrl = alvearOfertasUrl;
  await page.goto(searchUrl);

  const cantidadProd = await page.waitForXPath(
    '//*[@id="wrapper"]/div/div/div[2]/p'
  );

  let textoCant = await page.evaluate((el) => el.textContent, cantidadProd);

  // console.log(textoCant);

  let cantidad = await textoCant.match(/[0-9]{1,6}(?=[ \t]resultados)/);
  // console.log(cantidad);

  let cantidadProductos = parseInt(cantidad);
  // console.log("Cantidad de productos: ", cantidadProductos);
  /*
   * Alvear muestra 12 resultados por página, así que
   */
  let cantPag = Math.ceil(cantidadProductos / 12);
  // console.log("Cant Pág: ", cantPag);

  browser.close();
  return cantPag;
}

fetchAlvear();
