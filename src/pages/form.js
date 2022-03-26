import * as React from 'react';
import { graphql, useStaticQuery } from "gatsby";
import AddressCard from "../component/address-card";
import { createItem, SENDER, setApiUrl } from "../helpers";

const FormPage = () => {

  // const apiData = useStaticQuery(graphql`
  //   query MyQuery {
  //     api {
  //       appScriptUrl
  //     }
  //   }
  // `);

  // setApiUrl(apiData.api.appScriptUrl);

  const [text, setText] = React.useState('');
  const [data, setData] = React.useState({ id: null, name: '', address: '', note: '' });

  const parseAsData = (text) => {
    // remove all emojis
    let temp = text;
    temp = temp.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/m, '');
    // remove ผู้รับ
    temp = temp.replace(/^([0-9\.]+)?\s?.*ผู้รับ/m, '');

    // remove all spaces and new lines
    temp = temp.split(/\n+/m).filter(v => v.length > 1).join('\n');
    const temp_list = temp.split(/\n+/m);
    const name = temp_list.shift();
    const note = temp_list.pop();
    const address = temp_list.join('\n').replace(/\.\s+/mg, '.');
    return { name, address, note };
  };

  const resetData = () => {
    setText("");
    setData({ id: null, name: '', address: '', note: '' });
  };

  const updateSample = (e) => {
    setData((state) => ({ ...state, ...parseAsData(text) }));
  };

  const addData = () => {
    const recentData = parseAsData(text);
    if (data.id) {
      recentData.id = data.id;
    }
    // console.log(recentData);
    createItem(recentData).then(({ data }) => {
      resetData();
    });
  };

  React.useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      <div className="d-flex justify-content-center my-3">
        <a href="../listing" className="btn btn-primary">รายการทั้งหมด</a>
      </div>
      <div className="print-page">
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} style={{ width: "100%" }}>
          </textarea>
        </div>
        <div className="d-flex justify-content-center">
          <button onClick={updateSample} className="btn btn-outline-info me-3">ตัวอย่าง</button>
          <button onClick={resetData} className="btn btn-outline-danger me-3">ล้างข้อมูล</button>
          <button onClick={addData} className="btn btn-outline-primary me-3">เพิ่มข้อมูล</button>
        </div>
        <div className="space">&nbsp;</div>
        <AddressCard sender={SENDER} recipient={data} />
      </div>
    </div>
  );
};

export default FormPage;