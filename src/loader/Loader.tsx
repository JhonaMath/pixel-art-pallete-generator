import "./Loader.css";

function Loader(props: any) {

  return (<>
    <div className="spinner">
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
    <div>{props.percent ?? ""}</div>
  </>
  );
}

export default Loader;
