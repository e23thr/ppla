import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import AddressCard from "../component/address-card";
import { getList, setApiUrl, deleteItem } from "../helpers";

import { SENDER } from "../helpers";

const PAGE_SIZE = 25;
// markup
const IndexPage = () => {

  // const apiData = useStaticQuery(graphql`
  //   query MyQuery {
  //     api {
  //       appScriptUrl
  //     }
  //   }
  // `);

  // setApiUrl(apiData.api.appScriptUrl);

  const [items, setItems] = React.useState([]);

  const getAllItems = (page) => {
    getList(page * PAGE_SIZE, PAGE_SIZE).then(({ data }) => {
      setItems(items => [...items, ...data.data]);
      if (data.total > (page * PAGE_SIZE) + PAGE_SIZE) {
        getAllItems(page + 1);
      }
    });
  };

  const deleteAllItems = () => {
    Promise.all(items.map(item => deleteItem(item.id))).then(() => {
      setItems([]);
      getAllItems(0);
    });
  };

  React.useEffect(() => {
    setItems([]);
    getAllItems(0);
  }, []);

  const onDelete = (id) => {
    deleteItem(id).then(() => {
      setItems([]);
      getAllItems(0);
    });
  };

  return (
    <main>
      <title>Form</title>
      <div className="no-print d-flex justify-content-center my-3">
        <a className="btn btn-primary" href="./form">กรอกฟอร์ม</a>
      </div>
      {items.length > 0 && (
        <div className="no-print d-flex justify-content-center">
          <button className="btn btn-danger" onClick={deleteAllItems}>ลบรายการทั้งหมด</button>
        </div>
      )}
      <div className="print-page">
        {
          items.map((item, idx) => (
            <AddressCard sender={SENDER} recipient={item} key={idx} onDelete={onDelete} />
          ))
        }
      </div>
    </main>
  );
};

export default IndexPage;
