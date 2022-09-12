import Router, { useRouter } from "next/router";

const RedirectToSevenue = () => {
    const router = useRouter();

    return (
        <button className="redirectToSevenue" onClick={() => window.open(`http://sevenue.io/`, '_blank')} >
            
        </button>
    )
}

export default RedirectToSevenue
