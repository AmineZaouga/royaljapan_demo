"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { safeRequest } from "@/lib/api";
import Loading from "@/components/Loading";
import ErrorAlert from "@/components/ErrorAlert";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sitemap from "@/components/Sitemap";
import { useParams } from "next/navigation";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const FALLBACK_IMAGE = "/assets/images/placeholder.png";

function TopPage() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (id) localStorage.setItem("userID", id);
  }, [id]);

  useEffect(() => {
    setError(false);
    setErrorMsg("");

    if (!baseurl) {
      setError(true);
      setErrorMsg("Configuration error: API base URL is missing.");
      return;
    }

    if (!id) {
      setError(true);
      setErrorMsg("Invalid link. User identifier is missing.");
      return;
    }

    fetchProducts(id);
  }, [id]);

  const fetchProducts = async (userId) => {
    setLoading(true);
    setError(false);

    const res = await safeRequest({
      method: "get",
      url: `${baseurl}/api/user-products/${userId}`,
    });

    setLoading(false);

    if (!res.ok) {
      console.error("[TopPage] Product fetch failed:", res.error);
      setError(true);
      setErrorMsg(
        "We couldn’t load products at the moment. Please try again later."
      );
      return;
    }

    setProducts(res.data?.products || []);
  };

  return (
    <>
      <Header />

      <div className="product">
        {/* HERO */}
        <section className="top">
          <div className="top-img">
            <Image priority width={100} height={100} src="/assets/images/top-img.png" alt="" />
            <Image width={100} height={100} src="/assets/images/top-img02.png" className="sp" alt="" />
          </div>
          <img src="/assets/images/logo.svg" className="top-logo-img" alt="Royal Japan" />
          <p className="top-text1">
            ロイヤルジャパン
            <br />
            公式オンラインショッピング
          </p>
          <p className="top-text2">愛の証を超濃厚に、超濃密に</p>
          <p className="top-text3">ふたりだけの夜をもっと愉しむために</p>
        </section>

        {/* PRODUCT LIST */}
        <section className="list">
          <div className="list-title">全ての商品</div>
          <div className="contain">

            {loading && (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <Loading />
                <p style={{ marginTop: 12, opacity: 0.7 }}>Loading products…</p>
              </div>
            )}

            {error && (
              <div style={{ maxWidth: 520, margin: "40px auto" }}>
                <ErrorAlert message={errorMsg} />
                <button
                  style={{
                    marginTop: 16,
                    padding: "10px 16px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => fetchProducts(id)}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.7 }}>
                <p>No products are available for this store yet.</p>
              </div>
            )}

            {!loading &&
              !error &&
              products.map((item) => (
                <div className="list-item" key={item.id}>
                  <div className="list-item-thumb">
                    <Image
                      width={300}
                      height={300}
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title || "Product image"}
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    />
                  </div>

                  <h3 className="list-item-title">{item.title}</h3>
                  <div className="list-item-package">{item.package}</div>
                  <p className="list-item-content">{item.description}</p>

                  <div className="list-item-price">
                    <div className="wrap">
                      <div className="list-item-price-title">特別限定価格</div>
                      <p>
                        {Number(item.price_sell || 0).toLocaleString("en-US")}
                        <span>(税込)</span>
                      </p>
                    </div>
                    <a href={`/products/${id}/${item.id}`}>今すぐ購入する</a>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      <Footer />
      <Sitemap />
    </>
  );
}

export default TopPage;
