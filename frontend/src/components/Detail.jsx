'use client'
import { useState, useEffect } from "react"
import { safeRequest } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorAlert from '@/components/ErrorAlert';
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
function Detail({id, user, coupon, count, setPrice}){
    const [price_sell, setPriceSell] = useState("");
    const [price_id, setPriceId] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [percent, setPercent] = useState(0);
    const [subtitile, setSubTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(()=>{
        getProductData()       
    },[])
    const getProductData = async ()=>{      
        setLoading(true); setError(false);
        const res = await safeRequest({ method: 'get', url: `${baseurl}/api/product/${id}` });
        setLoading(false);
        if(!res.ok){ setError(true); setErrorMsg(res.error || 'Failed to load product'); return }
        const response = res.data
        if(coupon)
        {
            getCoupon()
        }
        setPrice(response.price_sell * count)
        setPriceSell(response.price_sell);
        setPriceId(response.price_id);
        setDescription(response.description);
        setTitle(response.title);
        setImage(response.image);
        setImage1(response.image1);
        setImage2(response.image2);
        setImage3(response.image3);
        setSubTitle(response.package);
    }

    const getCoupon = async () =>{
        let data = JSON.stringify({
            'user':user,
            'coupon':coupon ? coupon : ""
        });
        const res = await safeRequest({ method: 'post', url: `${baseurl}/api/coupon`, headers: { 'Content-Type': 'application/json' }, data });
        if(!res.ok){ setError(true); setErrorMsg(res.error || 'Failed to apply coupon'); return }
        const response = res.data
        setPercent(response.percent)
        if(response.percent!=0)
        {
            setPrice(price_sell * count)
        }
        else{
            setPrice(price_sell - price_sell * response.percent / 100)
        }
    }

    if(loading) return <Loading />
    if(error) return <ErrorAlert message={errorMsg} onClose={() => setError(false)} />

    return (
        <div className="wrap">
            <div className="detail-left pc">
                <div className="detail-main">
                    {image && <img src={image} alt=""/>}
                </div>
                <div className="detail-subimage">
                    <div className="detail-subimage-thumb">
                        {image1 && <img src={image1} alt=""/>}
                    </div>
                    <div className="detail-subimage-thumb">
                        {image2 && <img src={image2} alt=""/>}
                    </div>
                    <div className="detail-subimage-thumb">
                        {image3 && <img src={image3} alt=""/>}
                    </div>
                </div>
            </div>
            <div className="detail-right">
                <div className="detail-title">
                    {title}
                </div>
                <div className="detail-package">
                    {subtitile}
                </div>
                <p className="detail-text pc">
                    {description}
                </p>
                <div className="detail-count-sp">
                    <div className="detail-cost">
                        <div className="detail-count">
                            <p>数量</p>
                            <p>{count}</p>
                        </div>
                        <div className="detail-price">
                            <p>特別限定価格</p>
                            {percent !==0 && <p className="original">{parseInt(price_sell * count).toLocaleString('en-US').toString()}円 <span>(税込)</span></p>}
                            <p>{parseInt((price_sell - price_sell * percent / 100) * count).toLocaleString('en-US').toString()}円 <span>(税込)</span></p>
                        </div>
                    </div>
                    {/* <a href={`/order/${user}/${id}/${coupon}`} className="sp">今すぐ購入する</a> */}
                </div>
            </div>
            
        </div>
               
    )
}

export default Detail;