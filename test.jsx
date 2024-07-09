import { Nav } from "./test2";

export function App() {
  const name = true;
  return (
    <div>
      <Nav />
      {[1, 2, 3].map((num) => {
        return <p>{num}</p>;
      })}
      <h1>Hello World</h1>
      {name ? <div>name</div> : <div>noname</div>}
      <div>
        <p>
          rj1 209re1hdf9013jf01j9cn1309cn10nc03 03rj1f08c 130r\ n 183f01 cn3
        </p>
      </div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
