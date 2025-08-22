import Socials from '../_components/socials';
import './contact.scss';
import Hero from '../_components/hero';

export default function contactPage() {

    return (
        <div className="contact">
            <Hero title='Get in touch' small/>
            <div className='contact__contactInfos'>
                <p className='borderBottom'>
                    Follow me on 
                </p>
            <Socials/>
            </div>
            <p>
                Or shoot me an email : pi.terrancle@gmail.com
            </p>
        </div>
    )
}