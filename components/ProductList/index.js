import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

function ProductList({ data }) {
  const [isLoading, setIsLoading] = useState(true);
  const productList = data.data;

  useEffect(() => {
    !productList ? isLoading : setIsLoading(false);
  }, [productList]);

  return isLoading ? (
    <div className="container mx-auto my-auto">
      <div
        className="container mx-auto"
      >
        loading...
      </div>
    </div>
  ) : (
    <ul className='productList'>
      {productList.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export default ProductList;
