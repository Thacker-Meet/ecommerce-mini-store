import useAuth from "../hooks/useAuth";

function OrdersPage() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Orders Page</h1>

      <p>
        Welcome {user?.name}
      </p>

      <p>
        This is a protected page.
      </p>

      <p>
        Later we will show user orders here.
      </p>
    </div>
  );
}

export default OrdersPage;