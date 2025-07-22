import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";
export function Home() {
  const { t } = useTranslation();
  return (
    <div className="home-wrapper">
      <div className="home-top">
        <div className=" mb-4">
          {t("home.topLine1")} <br />
          {t("home.topLine2")}
        </div>
        <div>
          <Link
            to="appointment"
            className="text-white fw-bold px-3 py-2 rounded mt-3 d-inline-block text-decoration-none boxshadow border-0"
            style={{ cursor: "pointer" }}
          >
            {t("home.bookButton")} <span className="ms-2">&rarr;</span>
          </Link>
        </div>
      </div>{" "}
      <br />
      <div className="bg-text d-flex justify-content-center">
        {t("home.sectionHeading")}
      </div>
      <br />
      <div className="home-bottom fs-6">
        <div className="home-bottom-left">
          <p>
            <b>{t("home.desc1")}</b>
          </p>
          <p>
            <b>» {t("home.point1.title")}</b> {t("home.point1.desc")}
          </p>
          <p>
            <b> » {t("home.point2.title")}</b> {t("home.point2.desc")}
          </p>
          <p>
            <b>» {t("home.point3.title")}</b> {t("home.point3.desc")}
          </p>
          <p>
            <b> » {t("home.point4.title")}</b> {t("home.point4.desc")}
          </p>
          <p>
            <b> » {t("home.point5.title")}</b> {t("home.point5.desc")}
          </p>
        </div>
        <div className="home-bottom-right">
          <img src="/home-bottom-img.jpg" alt="Hospital Care" />
        </div>
      </div>{" "}
      <br />
      <div className="dotted-image">
        <div className="bg-text d-flex justify-content-center pt-4">
          {t("home.reviewHeading")}
        </div>{" "}
        <br />
        <div className="container">
          <div
            id="reviewCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="review-1.jpg"
                  className="d-block w-100"
                  alt={t("home.review1Alt")}
                  height="350"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="review-2.jpg"
                  className="d-block w-100"
                  alt={t("home.review2Alt")}
                  height="350"
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">{t("home.prev")}</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">{t("home.next")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
