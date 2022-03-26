import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";

import { getList, setApiUrl } from "../helpers";


const PAGE_SIZE = 25;
// markup
const IndexPage = () => {

  const apiData = useStaticQuery(graphql`
    query MyQuery {
      api {
        appScriptUrl
      }
    }
  `);

  setApiUrl(apiData.api.appScriptUrl);



  const [items, setItems] = React.useState([]);


  React.useEffect(() => {
    const getAllItems = (page) => {
      getList(page * PAGE_SIZE, PAGE_SIZE).then(({ data }) => {
        setItems(items => [...items, ...data.data]);
        if (data.total > (page * PAGE_SIZE) + PAGE_SIZE) {
          getAllItems(page + 1);
        }
      });
    };
    setItems([]);
    getAllItems(0);
  }, []);

  return (
    <main>
      <title>Form</title>

      {
        items.map((item, idx) => (
          <div key={idx}>
            <h1 className="header">{item.name}</h1>
          </div>
        ))
      }
    </main>
  );
};

export default IndexPage;
