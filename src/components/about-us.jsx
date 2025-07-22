import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./about.css";

export function About() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="container-fluid about-bg">
        <div className="title">{t("about.title")}</div>
        <span className="sub-title ms-2">{t("about.subtitle")}</span>
      </div>
      <br />
      <div className="description">
        <div className="fs-4 fw-bold">
          <Link
            to="/"
            className="text-primary fw-normal pe-2 text-decoration-none"
          >
            {t("about.breadcrumb")}
          </Link>
          {t("about.heading")}
        </div>
        {t("about.welcome")}
        <br /> <br />
        <b>{t("about.offer.heading")}</b> {t("about.offer.points")}
        <br /> <br />
        <b>{t("about.mission")}</b> {t("about.mission.text")}
        <br /> <br />
        <b>{t("about.why")}</b> {t("about.why.text")}
      </div>
      <br />
      <div className="d-flex justify-content-center btm-title">
        {t("about.footer")}
      </div>
    </div>
  );
}
