function Dialog({ openAction, title, subtitle, renderCancel, handleCancel, handleOk }) {
    return (
      <dialog className="nes-dialog is-rounded z-10" open={openAction}>
        <form method="dialog">
          <p className="title mb-5">{title}</p>
          <p className="mb-5">{subtitle}</p>
          <menu className="dialog-menu">
            {renderCancel && (
              <button onClick={handleCancel} className="mr-5 nes-btn">Cancel</button>
            )}
            <button onClick={handleOk} className="nes-btn is-primary">Ok</button>
          </menu>
        </form>
      </dialog>
    );
  }
  
  export default Dialog;
  