import Image from "next/image"
import './hero.scss'
export default function Hero({title, small} : {title : string, small?:boolean}){
    return(
        <div className={`landing hero ${small?'small':' '}`}>
            <div className="landing hero__title">
                <h1>{title}</h1>
            </div>  
            <div className="landing hero__imgWrapper">
                <Image src="/svg/largeWave.svg" alt='' fill objectFit="cover"/>
            </div>
        </div>
    )

}