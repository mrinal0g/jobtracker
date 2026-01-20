import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <h1>Uh Oh! - The page you are looking for does not exist</h1>
      <Link to="/">
        <button>Go back to Home page</button>
      </Link>
    </>
  );
};
export default NotFoundPage;
