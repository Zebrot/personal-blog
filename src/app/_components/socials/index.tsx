import Image from "next/image"
import Link from "next/link"
import './socials.scss'
export default function Socials() {
    return (
        <div className="socials">
            <Link href={'https://www.linkedin.com/in/pierre-terrancle/'}><Image src='svg/linkedIn.svg' width={40} height={40} alt="linkedIn" /></Link>
            <Link href={'https://github.com/Zebrot'}><Image src='svg/github.svg' width={40} height={40} alt="github" /></Link>
        </div>
    )
}