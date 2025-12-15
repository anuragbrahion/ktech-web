import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignaturePadInput = forwardRef(({ label }, ref) => {
  const sigPadRef = useRef();
  const [name, setName] = useState('');

  // Expose some methods to parent via ref (like getSignature)
  useImperativeHandle(ref, () => ({
    getSignature: () => {
      if (sigPadRef.current.isEmpty()) return null;
      return {
        name,
        signatureDataURL: sigPadRef.current.toDataURL('image/png'),
      };
    },
    clear: () => {
      sigPadRef.current.clear();
      setName('');
    },
  }));

  return (
    <div classname="w-full max-w-full overflow-hidden">
      <label className="block mb-1 font-semibold">{label}</label>
      {/* <input
        type="text"
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /> */}
    <div className="w-full overflow-hidden">
       <SignaturePad
        ref={sigPadRef}
        canvasProps={{
          width: 400,
          height: 200,
          className: 'sigCanvas max-w-full',
          style: {
            order: '1px solid #ccc',
          background: '#f9f9f9',
          cursor: 'crosshair',
          maxWidth: '100%',
          height: 'auto',
          },
        }}
      />
    </div>
      <button
        type="button"
        onClick={() => {
          sigPadRef.current.clear();
          setName('');
        }}
        className="mt-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
      >
        Clear
      </button>
    </div>
  );
});

export default SignaturePadInput;
