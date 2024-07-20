import './PageNotFound.css'
import logo from './../../assets/images/coffeandcode.png'
export const PageNotFound = () => {
    return (
        <div className="container">
            <div className='container-2'>
                <div>
                    <img src={logo} alt="Logo de coffee and code" />
                </div>
                <hr />
                Page Not Found
            </div>
        </div>
    )
}