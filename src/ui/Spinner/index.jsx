import "./styles.css";
import spinnerImage from "../../assets/img/spinner.gif";

const Spinner = () => {
  return (
    <div className="overlay">
      <img src={spinnerImage} alt="Carregando" className="spinner-image" />
    </div>
  );
};

export { Spinner };
