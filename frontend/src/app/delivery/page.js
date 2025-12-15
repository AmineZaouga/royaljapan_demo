'use client'
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { safeRequest } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorAlert from '@/components/ErrorAlert';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sitemap from '../../components/Sitemap';
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

function DeliveryPage() {
    const [displayData, setDisplayData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(()=>{
        getPageData()
    },[])
    const getPageData = async (id)=>{
        setLoading(true); setError(false)
        const res = await safeRequest({ method: 'get', url: `${baseurl}/api/get-page-data` })
        setLoading(false)
        if(!res.ok){ setError(true); setErrorMsg(res.error || 'Failed to load'); return }
        let tmp_data = {}
        res.data.settings.forEach(element => {
            tmp_data = {...tmp_data, [element.key]:element.value}

        });
        setDisplayData(tmp_data)
    }

    return(
        <>
            <Header/>
            <div className="product">
                <section className="top">
                    <div className="top-img">
                        <img src="/assets/images/top-img.png" alt=""/>
                        <img src="/assets/images/top-img02.png" className="sp" alt=""/>
                    </div>
                    <img src="/assets/images/logo.svg" className="top-logo-img" alt=""/>
                    <p className="top-text1">ロイヤルジャパン<br/>公式オンラインショッピング</p>
                    <p className="top-text2">愛の証を超濃厚に、超濃密に</p>
                    <p className="top-text3">ふたりだけの夜をもっと愉しむために</p>
                </section>

                <section className="list">
                    <div className="sub-page-title">
                        {displayData["delivery-title"]}
                    </div>
                    <div className="contain">
                        <p>{displayData["delivery-main-description"]}</p>
                        <div style={{display:"flex"}}>
                            <img style={{minWidth:"200px", minHeight:"200px"}} src={displayData["delivery-image"]}  alt=""/>
                            <p>{displayData["delivery-sub-description"]}</p>
                        </div>

                    </div>
                </section>
            </div>
            {/* <Footer/> */}
            <Sitemap/>

        </>
    )
}
export default DeliveryPage;