import { useEffect, useState, useCallback } from "react";
import Cookies from 'js-cookie';
import Router, { useRouter } from "next/router";
import EventLayout from '../layout/EventLayout';

const EventAdminLogin = (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { eventUrl } = router.query;

    useEffect(() => {
        let cookieAdminData = Cookies.get('eventadmin_token');
        let adminData = localStorage.getItem('eventadmin_token');

        if (adminData && cookieAdminData && adminData === cookieAdminData) {
            return setLoading(false);
        } else {
            document.cookie = "";
            localStorage.clear();
            return Router.push(`/${eventUrl}/admin`);
        }
      }, [eventUrl]);

    return (
        <>
        {
            loading ? 
                <div className="setLoader"><div className="loader"></div></div>
            :
            <EventLayout nav={props.nav}>
                {props.children}
            </EventLayout>
        }
        </>
    )
}

export default EventAdminLogin
