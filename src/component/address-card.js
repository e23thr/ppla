import React from 'react';

const AddressCard = ({ sender, recipient, onDelete = null }) => {

  const [isDeleting, setIsDeleting] = React.useState(false);
  return (
    <React.Fragment>
      <div className="print-card">
        <div className="name">ผู้ส่ง</div>
        <div className="name">{sender.name}</div>
        <div className="address">{sender.address}</div>
        {sender.footer && (
          <div>
            <hr />
            <div className="print-footer">{sender.footer}</div>
          </div>
        )}
        <div className="space">&nbsp;</div>
        <div className="name">ผู้รับ</div>
        <div className="name">{recipient.name}</div>
        <div className="address">{recipient.address.split("\n").map((d, idx) => <div className="text-justify" key={`addr-${idx}`}>{d}</div>)}</div>
        <div className="space">&nbsp;</div>
        <div className="print-footer">{recipient.note}</div>
        {onDelete && (
          <div className="no-print d-flex justify-content-center mb-3">
            {isDeleting ? (
              <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            ) : (
              <button className="btn btn-danger" onClick={() => {
                setIsDeleting(true);
                onDelete?.(recipient.id);
              }}>ลบรายการ</button>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default AddressCard;