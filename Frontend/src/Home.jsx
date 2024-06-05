import { useCookies } from 'react-cookie'
import "./Home.css";

function Home() {
    const [cookies, setCookies] = useCookies(["email", "imageId", "isSeller", "isLoggedIn"]);

    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h>SIXERR</h>
                </div>
                <div className='flex justify-end'>
                    {cookies.isSeller ? (
                        <a className="navButtons" href="seller">About Seller</a>
                    ) : (
                        <a className="navButtons" href="registerSeller">Become a Seller</a>
                    )}
                    {cookies.isLoggedIn ? (
                        <div>
                            <a className="navButtons" href="aboutMe">About Me</a>
                            <a className="navButtons" onClick={e => {
                                e.preventDefault();
                                setCookies("isLoggedIn", false);
                            }}>Sign Out</a>
                            <div className='circle'>
                                <img src={`https://drive.google.com/thumbnail?id=${cookies.imageId}`} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <a className="navButtons" href="login">Sign In</a>
                            <a className="navButtons" href="register">Join</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
