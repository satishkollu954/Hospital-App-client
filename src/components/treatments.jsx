import { Link } from "react-router-dom";
import "./treatments.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export function Treatment() {
  const [state, setState] = useState([{ disease: "", description: "" }]);
  const { t, i18n } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${apiUrl}/admin/getdisease`, {
        params: { lang: i18n.language },
        signal: controller.signal,
      })
      .then((res) => setState(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("Failed to fetch diseases:", err);
          setState([]);
        }
      });

    return () => controller.abort();
  }, [i18n.language]);

  return (
    <div>
      <div className="trm-bg"></div>
      <br />

      <div className="fs-4 fw-bold trt-text">
        <Link
          to="/"
          className="text-primary fw-normal pe-2 text-decoration-none"
        >
          {t("common.home")} »
        </Link>
        {t("treatments.pageTitle")}
      </div>

      <div className="trt-bottom">
        <div className="trt-bottom-left">
          {t("treatments.description1")}
          <br />
          <br />
          {t("treatments.description2")}
          <br />
          <br />
          {t("treatments.description3")}
        </div>

        <div className="trt-bottom-right">
          <img src="/trt-img.jpg" alt={t("treatments.imageAlt")} />
        </div>
      </div>

      <br />
      <br />

      <div className="card-bg">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {state.map((item, index) => (
            <div
              key={index}
              className="card p-2 m-2 shadow h-150"
              style={{ width: "300px" }}
            >
              <div
                className="card-header fs-5 fw-bold"
                style={{ color: "gray" }}
              >
                {item.disease}
              </div>
              <div className="card-body fs-6" style={{ color: "grey" }}>
                {item.description}
              </div>
              <div className="ms-3">
                {item.learnmore && (
                  <a
                    href={item.learnmore}
                    target="_blank"
                    className="btn btn-sm btn-outline-success"
                  >
                    {t("treatments.learnMore")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
