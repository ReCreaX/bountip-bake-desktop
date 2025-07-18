import { BadgeCheck, X } from "lucide-react";

type SuccessModalProp = {
  heading: string;
  description: string;
};
const SuccessModal = ({heading="Save Successful!", description="Your update has been saved successfully"}: SuccessModalProp) => {
  return (
    <section className="flex">
      <section className="">
        <div className="flex items-center">
          <BadgeCheck />
          <h3 className="">{heading}</h3>
        </div>
        <p className="">{description}</p>
      </section>
      <X />
    </section>
  );
};

export default SuccessModal;
