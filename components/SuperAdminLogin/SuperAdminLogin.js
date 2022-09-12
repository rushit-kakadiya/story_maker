import { useEffect, useState, useCallback } from "react";
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router'
import SuperLayout from '../layout/SuperLayout';


const EventAdminLogin = (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { eventUrl } = router.query;

    useEffect(() => {
            let cookieAdminData = Cookies.get('superadmin_token');
            let adminData = localStorage.getItem('superadmin_token');

            if (adminData && cookieAdminData && adminData === cookieAdminData) {
                return setLoading(false);
            } else {
                document.cookie = "";
                localStorage.clear();
                return Router.push(`/superadmin`);
            }
      }, [eventUrl]);

    return (
        <>
        {
            loading ? 
                <div className="setLoader"><div className="loader"></div></div>
            :
            <SuperLayout nav={props.nav}>
                {props.children}
            </SuperLayout>
        }
        </>
    )
}

export default EventAdminLogin
