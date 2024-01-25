import {useState} from 'react'

export function Paint({ key, data }) {
    const [reveal, setReveal] = useState(false);

    return (
        <>
            <span className={data.level === 'Factory New' ? 'text-center font-bold drop-shadow-md drop-shadow-amber-200 animate-pulse text-amber-400' : 'hidden'}>
                LEGENDARY PULL
            </span>
            <div key={key} className={`p-3 border border-white rounded-md bg-white/5 text-start w-full my-2 animate-in zoom-in transition-all ease-in-out`}>
                <button onClick={() => setReveal(true)} className="text-2xl w-full text-start">
                    <span className={`fade-in ease-in-out transition-all font-mono ${reveal ? 'hidden' : 'inline'}`}>
                        [REVEAL]
                    </span>
                    <span className={`animate-in spin-in transition-all ease-in-out ${!reveal ? 'hidden' : 'inline'}`} style={{ background: data.gradient, textShadow: data.glow, WebkitBackgroundClip: data.bgClip, WebkitTextFillColor: data.tfcolor, backgroundClip: data.bgClip }}>
                        <b>{data.name}</b>
                    </span>
                    <br />
                    <div className={`text-sm animate-in spin-in transition-all ease-in-out ${!reveal ? 'hidden' : 'inline'}`} >
                        DR: {data.float} | {data.colorCount} colors | { data?.glow ? 'Ultra-Rare Glow' : ''}
                    </div>
                </button>
            </div>
        </>
    );
}
