import React from "react";
import ImageWithFallback from "../customComponents/ImageWithFallback";
import { ALVEAR_IMG_FALLBACK } from "../../utils/constants/constants";
import blurImg from "../../public/assets/bluredPlaceholders/blurData.png";
function ProductCard({ product }) {
  const {
    id,
    product_name,
    category,
    img_url,
    product_url,
    regular_price,
    discount_price,
  } = product;
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-5 ">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <ImageWithFallback
              className="h-48 w-full object-cover md:h-full md:w-48"
              src={img_url}
              fallbackSrc={ALVEAR_IMG_FALLBACK}
              alt={product_name}
              width={150}
              height={150}
              layout="intrinsic"
              placeholder="blur"
              blurDataURL={blurImg}
            />
          </div>
          <div className="p-8">
            <div className="bg-red-200 text-red-800 text-xs ml-100 px-2 inline-block rounded-tl-lg rounded-br-lg p-4 uppercase font-semibold">
              {Math.round(
                ((discount_price - regular_price) * 100) / regular_price
              )}
              %
            </div>
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {category}
            </div>
            <a
              href={product_url}
              className="no-underline block mt-1 text-lg leading-tight font-medium text-black"
            >
              {product_name}
            </a>
            <p className="mt-2 text-gray-500">Some dummy text</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
