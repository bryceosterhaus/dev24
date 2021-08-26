import Head from "next/head";
const spritemap = "/icons.svg";

import { ClayMultiStepNavWithBasicItems } from "@clayui/multi-step-nav";
import { ClayRadio, ClayRadioGroup } from "@clayui/form";
import ClayButton from "@clayui/button";
import { Sheet, SheetFooter, SheetHeader, SheetSection } from "@clayui/layout";
import ClayCard, { ClayCardWithInfo } from "@clayui/card";
import ClayLoadingIndicator from "@clayui/loading-indicator";

const QUESTIONS = [
  {
    answers: [
      "Same as or below speed limit",
      "Whats a speed limit?",
      "I can't see anything around me",
    ],
    question: "How fast do you like to drive?",
  },
  {
    answers: ["Empyrean", "Flame", "Supremacy"],
    question: "What model do you drive?",
  },
  {
    answers: [2017, 2018, 2019, 2020],
    question: "What year is your car?",
  },
  {
    answers: [
      "As little as possible",
      "Right in the middle",
      "There is no limit when it comes to speed!",
    ],
    question: "How much do you want to spend?",
  },
];

let client;

export default function Home() {
  const [responses, setResponses] = React.useState(Array(4).fill(undefined));
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [recomendations, setRecomendations] = React.useState();

  const { answers, question } = QUESTIONS[step];

  React.useEffect(() => {
    let SDK = window.__LIFERAY_REMOTE_APP_SDK__;

    if (!SDK) {
      console.error("No __LIFERAY_REMOTE_APP_SDK__ on window");

      return "No __LIFERAY_REMOTE_APP_SDK__ on window";
    }

    client = new SDK.Client({ debug: true });
  }, []);

  const handleSubmit = () => {
    setFinished(true);

    client.get("userName").then(function (value) {
      setName(value);
    });

    setTimeout(() => {
      setRecomendations([
        {
          href: "http://localhost:8080/web/speedwell/p/oil-pump",
          img:
            "http://localhost:8080/o/commerce-media/products/42992/oil-pump-1/43014/Speedwell_ProductImage_33.png",
          title: "Oil Pump",
          price: "$79.00",
        },
        {
          href: "http://localhost:8080/web/speedwell/p/u-joint",
          img:
            "http://localhost:8080/o/commerce-media/products/43684/u-joint-1/43706/Speedwell_ProductImage_64.png",
          title: "U-Joint",
          price: "$24.00",
        },
        {
          href: "http://localhost:8080/web/speedwell/p/coil-spring-rear",
          img:
            "http://localhost:8080/o/commerce-media/products/43366/coil-spring-rear-1/43387/Speedwell_ProductImage_13.png",
          title: "Coil Spring - Rear",
          price: "$ 104.00",
        },
      ]);
    }, 500);
  };

  const totalQuestions = QUESTIONS.length;

  return (
    <div>
      <Head>
        <title>Parts Finder</title>

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@clayui/css/lib/css/atlas.css"
        />
        <script src="http://localhost:8080/o/remote-app-client-js/remote-app-client-js.js"></script>
      </Head>

      <Sheet size="lg" style={{ marginTop: 24, minHeight: 420 }}>
        <SheetHeader>Car Parts Finder</SheetHeader>
        {!finished && (
          <>
            <ClayMultiStepNavWithBasicItems
              activeIndex={step}
              maxStepsShown={totalQuestions}
              onIndexChange={setStep}
              spritemap={spritemap}
              steps={Array(totalQuestions).fill({})}
            />

            <div className="sheet-text">{question}</div>

            <SheetSection>
              <ClayRadioGroup
                onSelectedValueChange={(val) => {
                  const newResponses = [...responses];

                  newResponses[step] = val;

                  setResponses(newResponses);
                }}
                selectedValue={responses[step]}
              >
                {answers.map((answer, i) => (
                  <ClayRadio label={answer} value={i} key={answer} />
                ))}
              </ClayRadioGroup>
            </SheetSection>

            <SheetFooter>
              <ClayButton.Group spaced>
                <ClayButton
                  disabled={step === 0}
                  displayType="secondary"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </ClayButton>

                {step !== totalQuestions - 1 && (
                  <ClayButton
                    displayType="secondary"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </ClayButton>
                )}

                {step === totalQuestions - 1 && (
                  <ClayButton onClick={handleSubmit}>Submit</ClayButton>
                )}
              </ClayButton.Group>
            </SheetFooter>
          </>
        )}

        {finished && (
          <>
            {(!recomendations || !name) && <ClayLoadingIndicator />}

            {recomendations && name && (
              <>
                <div className="sheet-text">
                  The parts below are specially picked for "{name}"
                </div>

                <SheetSection className="row">
                  {recomendations.map((item, i) => (
                    <div className="col-md-4" key={i}>
                      <ClayCard displayType="image">
                        <ClayCard.AspectRatio className="card-item-first">
                          <img
                            alt="thumbnail"
                            className="aspect-ratio-item aspect-ratio-item-center-middle aspect-ratio-item-fluid"
                            src={item.img}
                          />
                        </ClayCard.AspectRatio>
                        <ClayCard.Body>
                          <ClayCard.Row>
                            <div className="autofit-col autofit-col-expand">
                              <section className="autofit-section">
                                <ClayCard.Description
                                  displayType="title"
                                  onClick={(e) => {
                                    client.navigate(item.href);

                                    e.preventDefault();
                                  }}
                                  href={item.href}
                                >
                                  {item.title}
                                </ClayCard.Description>
                                <ClayCard.Description displayType="subtitle">
                                  Price: <b>{item.price}</b>
                                </ClayCard.Description>
                              </section>
                            </div>
                          </ClayCard.Row>
                        </ClayCard.Body>
                      </ClayCard>
                    </div>
                  ))}
                </SheetSection>
              </>
            )}
          </>
        )}
      </Sheet>
    </div>
  );
}
