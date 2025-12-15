'use client'
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { safeRequest } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorAlert from '@/components/ErrorAlert';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Sitemap from '../components/Sitemap';
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
function SubPage({page}) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    useEffect(()=>{
        getPageData()
    },[])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const getPageData = async (id)=>{
        setLoading(true)
        setError(false)
        const res = await safeRequest({ method: 'get', url: `${baseurl}/api/get-page-data` })
        setLoading(false)
        if(!res.ok){
            setError(true)
            setErrorMsg(res.error || 'Failed to load page data')
            return
        }
        let tmp_data = {}
        res.data.settings.forEach(element => {
            tmp_data = {...tmp_data, [element.key]:element.value}
        });
        if(page=="specified")
        {
            setTitle(tmp_data["specified-title"])
            setContent(tmp_data["specified-description"])
        }
        if(page=="personal"){
            setTitle(tmp_data["protected-title"])
            setContent(tmp_data["protected-description"])
        }
        if(page=="privacy"){
            setTitle(tmp_data["privacy-title"])
            setContent(tmp_data["privacy-title"])
        }
    }

    return(
        <>
            <Header/>
            <div className="product">
                <section className="top">
                    <div className="top-img">
                        <Image
                          width={100}
                          height={100} src="/assets/images/top-img.png" alt=""/>
                        <Image
                          width={100}
                          height={100} src="/assets/images/top-img02.png" className="sp" alt=""/>
                    </div>
                    <img src="/assets/images/logo.svg" className="top-logo-img" alt=""/>
                    <p className="top-text1">ロイヤルジャパン<br/>公式オンラインショッピング</p>
                    <p className="top-text2">愛の証を超濃厚に、超濃密に</p>
                    <p className="top-text3">ふたりだけの夜をもっと愉しむために</p>
                </section>

                <section className="list">
                    <div className="sub-page-title">
                        {title}
                    </div>
                    <div className="contain">

                        <div style={{display:"flex"}}>
                            <p>{content}</p>
                        </div>

                    </div>
                </section>
            </div>
            <Sitemap/>

        </>
    )
}
export default SubPage;