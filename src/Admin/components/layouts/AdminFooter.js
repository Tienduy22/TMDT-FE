import React from "react";

export default function AdminFooter() {
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          Jewelry Store
          <div className="copyright ml-auto">
            {" "}
            Copyright &copy;&nbsp;
            {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </>
  );
}
