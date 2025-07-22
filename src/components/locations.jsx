import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Location.css";
import { useTranslation } from "react-i18next";

export const Location = () => {
  const { t, i18n } = useTranslation();
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  /* 🔄 refetch whenever language changes */
  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${apiUrl}/admin/locations`, {
        params: { lang: i18n.language }, // hi | te | en | …
        signal: controller.signal,
      })
      .then((res) => {
        setCities(res.data);
        setError("");
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("Error fetching locations:", err);
          setError(t("locations.fetchError"));
          setCities([]);
        }
      });

    return () => controller.abort();
  }, [i18n.language, t]);

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-5">{t("locations.title")}</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {cities.map((cityData, index) => (
        <div key={index} className="mb-5">
          <h4 className="text-dark fw-bold mb-3">{cityData.State}</h4>

          <div className="row">
            {Array.isArray(cityData.branches) &&
              cityData.branches.map((branch, idx) => (
                <div key={idx} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">{branch.name}</h5>

                      {branch.mapUrl && (
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary mt-3"
                        >
                          {t("locations.viewOnMap")}{" "}
                          <i className="bi bi-geo-alt-fill ms-1"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
