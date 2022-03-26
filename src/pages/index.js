import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";

import { getList, setApiUrl } from "../helpers";

const SENDER = {
  name: 'เพจ: Shuberry Sofa Shoes',
  address: `ที่อยู่: 126 ม.1 ต. ศรีสุราษฎร์
  อ.ดำเนินสะดวก จ.ราชบุรี 70130
  ติดต่อ: 065-8063665`,
  footer: 'ขอบคุณลูกค้าทุกท่านที่มาอุดหนุนค่ะ'
};

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

      <div className="print-page">
        {
          items.map((item, idx) => (
            <div key={idx} className="card">
              <h1 className="name">ผู้ส่ง</h1>
              <h1 className="name">{SENDER.name}</h1>
              <h2 className="address">{SENDER.address}</h2>
              {SENDER.footer && (
                <div>
                  <hr />
                  <div className="footer">{SENDER.footer}</div>
                </div>
              )}
              <div className="space">&nbsp;</div>
              <h1 className="name">ผู้รับ</h1>
              <h1 className="name">{item.name}</h1>
              <h2 className="address">{item.address}</h2>
              <div className="space">&nbsp;</div>
              <div className="footer">{item.note}</div>
            </div>
          ))
        }
      </div>
    </main>
  );
};

export default IndexPage;
