import { useRouter } from "next/router";
import React from "react";

import Item from "@/components/ui/animation/Item";
import Button from "@/components/ui/button";
import i18n from "@/utils/i18n";

const langs = ["fr", "en"];

const SwitchLang = () => {
  const router = useRouter();

  const changeLanguage = (lng: React.Key) => {
    router.push(router.pathname, router.asPath, { locale: lng as string });
    i18n.changeLanguage(lng as string);
  };

  return (
    <div className="flex flex-row items-center justify-start gap-12 xxs:gap-8 mdl:gap-6 lg:gap-8">
      {langs.map(l => (
        <span key={l} className="overflow-hidden ">
          <Button
            degree="2"
            size="xs"
            className="uppercase"
            onPress={() => changeLanguage(l)}
            style={{
              color: "inherit"
            }}
          >
            <Item defaultColor="var(--color-white-600)">{l}</Item>
          </Button>
        </span>
      ))}
    </div>
  );
};

export default SwitchLang;
