import { Form, Link, NavLink, useActionData, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { createPaints, getPaints, openPack } from "../backend/create";
import { useState, useEffect, useRef } from 'react'
import { Paint } from "../components/paint-comp";
import { RouteErrorComponent } from "../components/route-error";

export const meta = () => {
    return [{ title: '7tv gamba' }, { name: 'description', content: 'gambaaa' }, { name: 'theme-color', content: '#27272c' }];
};

export let loader = async () => {
    return null
};

export const action = async ({ request }) => {
    let formData = await request.formData();
    let { _action, ...values } = Object.fromEntries(formData);

    if (_action && _action === "create") {
        return createPaints()
    } else if (_action && _action === "pack") {
        let pack = values.packType

        return await openPack(pack)
    } else {
        return null
    }
};

export default function Index() {
    let formRef = useRef()
    let data = useActionData()
    let transition = useNavigation()
    const [points, setPoints] = useState(10000);
    let isSubmitting = transition.state === 'submitting';
    let [packType, setPackType] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);

    let pointTable = [
        {name: "STARTER", price: 100},
        {name: "EPIC", price: 200},
        {name: "MASTER", price: 500}
    ]

    useEffect(() => {
        if (!isSubmitting) {
            formRef.current?.reset();
        }
    }, [isSubmitting]);

    const handleButtonClick = () => {
        setButtonClicked(true);
    };

    useEffect(() => {
        if (buttonClicked) {
            if (packType) {
                // Find the packType in pointTable
                const pack = pointTable.find((n) => n.name === packType);

                if (pack) {
                    // Update points based on the pack's price
                    setPoints((prevPoints) => prevPoints - pack.price);
                }
            }
            setButtonClicked(false);
        }
    }, [buttonClicked]);

    return (
        <div>
            <div className={`animate-in fade-in transition-all duration-1000 ease-in-out text-center ${data ? 'hidden' : 'block'} `}>
                <b>7tv paint packs | points: {points}</b>
                <br />
                <br />
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:w-2/3">
                        <button className={`col-span-1 text-center border-2 justify-start container hover:bg-green-400/10 transition-all ease-in-out duration-100 border-green-400 rounded-md p-5 ${packType === "STARTER" ? "bg-green-400/20" : ""}`} onClick={() => setPackType("STARTER")}>
                            <span className="font-tikigym text-2xl px-2 py-1 bg-white/5 rounded-full shadow-md">
                                STARTER PACK
                            </span>
                            <br />
                            <br />
                            <p className="font-mono font-bold">
                                3 Common Paints
                            </p>
                            <small>t$100</small>
                        </button>
                        <button className={`col-span-1 text-center border-2 justify-start container hover:bg-purple-600/10 transition-all ease-in-out duration-100 border-purple-600 rounded-md p-5 ${packType === "EPIC" ? "bg-purple-600/20" : ""}`} onClick={() => setPackType("EPIC")}>
                            <span className="font-tikigym text-2xl px-2 py-1 bg-white/5 rounded-full shadow-md">
                                EPIC PACK
                            </span>
                            <br />
                            <br />
                            <p className="font-mono font-bold">
                                1-4 Rare OR Epic
                            </p>
                            <small>t$200</small>
                        </button>
                        <button className={`col-span-1 text-center border-2 justify-start container hover:bg-yellow-500/10 transition-all ease-in-out duration-100 border-yellow-500 rounded-md p-5 ${packType === "MASTER" ? "bg-yellow-500/20" : ""}`} onClick={() => setPackType("MASTER")}>
                            <span className="font-tikigym text-2xl px-2 py-1 bg-white/5 rounded-full shadow-md">
                                MASTER PACK
                            </span>
                            <br />
                            <br />
                            <p className="font-mono font-bold">
                                Guaranteed Epics 1-5
                                <br />
                                Increased chance of Legendary
                            </p>
                            <small>t$500</small>
                        </button>
                    </div>
                </div>

                <br />
                <br />
                <Form ref={formRef} method="post">
                    <input type="text" name="packType" value={packType} onChange={(e) => setPackType(e.target.value) } hidden required></input>
                    <button className="px-5 py-1 rounded-sm font-bold text-2xl bg-[#7a51c8] hover:bg-[#8a5ddd]" onClick={handleButtonClick} type="submit" name="_action" value="pack">{transition.state === "submitting" ? "OPENING" : "OPEN"}</button>
                </Form>
            </div>

            <div className={` grid grid-cols-1 m-2 lg:grid-cols-3 animate-in zoom-in transition-all duration-1000 text-center ${!data ? 'hidden' : 'block'}`}>
                <br className="hidden md:block" />
                <div className="animate-in spin-in transition-all mt-10 col-span-1">
                    <div className="animate-bounce font-tikigym text-4xl">{packType} Pack Opening</div>
                    <div className={`bg-[#27272c40] filter backdrop-blur-md shadow-xl p-4 md:p-10 rounded-xl rounded-t-none ${packType === "MASTER" ? 'shadow-amber-300 border-b-2 border-x-2 border-amber-100' : packType === "EPIC" ? 'shadow-purple-500 border-b-2 border-x-2 border-purple-100' : 'shadow-green-400 border-b-2 border-x-2 border-green-100'}`}>
                        {
                            data ? data?.length > 0
                                ?
                                data.map((p, i) => (
                                    <>
                                        <Paint key={i} data={p} />
                                    </>
                                ))
                                :
                                <>
                                    Nothing!!
                                </>
                                :
                                <>
                                    You won nothing fuck you
                                </>
                        }
                    </div>
                    <br />
                    <br />
                    <br />
                    <NavLink to="/" className="px-4 py-2 rounded-lg font-bold text-2xl bg-green-400 hover:bg-green-300">
                        Open Another Pack
                    </NavLink>
                </div>
                <br />
                <br />
                <br />
            </div>


            <Form method="post" className="hidden">
                <button type="submit" name="_action" value="create">Create Paints</button>
            </Form>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    return <RouteErrorComponent error={error} />;
}