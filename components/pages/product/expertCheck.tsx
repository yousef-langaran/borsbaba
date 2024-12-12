import React, {useEffect} from "react";
import {array} from "yup";
import {CoreTitle} from "@/components/core/title";

// بخش نمایش دهنده هر نوع قالب
const SectionRenderer = ({section}:any) => {
    switch (section.template) {
        case "text":
            return <p dangerouslySetInnerHTML={{__html: section.text}}/>;

        case "text-image":
            return (
                <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <p dangerouslySetInnerHTML={{__html: section.text}}/>
                    <img src={section.image} alt="" style={{maxWidth: "100%", borderRadius: "8px"}}/>
                </div>
            );

        case "image-text":
            return (
                <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <img src={section.image} alt="" style={{maxWidth: "100%", borderRadius: "8px"}}/>
                    <p dangerouslySetInnerHTML={{__html: section.text}}/>
                </div>
            );

        default:
            return <p>Unsupported section type</p>;
    }
};

interface ExpertCheckProps {
    expertCheck?: any
}

const ExpertCheck = ({expertCheck}: ExpertCheckProps) => {
    return (
        <div>
            <CoreTitle title={"بررسی تخصصی"}/>
            <div style={{fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding: "1rem"}}>
                {Array.isArray(expertCheck) && expertCheck.map((item, index) => (
                    <section key={index} style={{marginBottom: "2rem"}}>
                        <h2>{item.title}</h2>
                        {item.sections.map((section:any, idx:any) => (
                            <SectionRenderer key={idx} section={section}/>
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default ExpertCheck;