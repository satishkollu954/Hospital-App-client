export function Unauthorized() {
  return (
    <div
      className="text-center text-danger d-flex justify-content-center align-items-center flex-column"
      style={{ height: "70vh" }}
    >
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  );
}
