import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import { IEvent, EventCategories, IEventInflated } from "../../models/Event";
import FormGroup from "../shared/FormGroup";
import SelectInput from "../shared/SelectInput";
import { Partial } from "../../models/TypeBucket";
import { Domain, Domains } from "../../models/Domain";

interface IProps {
  event: IEvent;
  updateEvent: (e: Partial<IEventInflated>) => void;
}

export default function EventCategoryPicker(props: IProps) {
  const t = useContext(I18nContext);

  const categoryOptions = Object.keys(EventCategories[props.event.domain]);

  const subcategoryOptions = props.event.category
    ? EventCategories[props.event.domain][props.event.category] || null
    : null;

  return (
    <React.Fragment>
      <FormGroup label={t("Domain")}>
        <SelectInput
          value={props.event.domain}
          setValue={domain =>
            props.updateEvent({
              subcategory: "",
              category: "",
              domain: domain as Domain
            })
          }
          options={SelectInput.translatedOptions(Domains, t, "domains")}
        />
      </FormGroup>

      {categoryOptions.length > 0 && (
        <React.Fragment>
          <FormGroup label={t("Category")}>
            <SelectInput
              value={props.event.category}
              setValue={category =>
                props.updateEvent({ subcategory: "", category })
              }
              options={SelectInput.translatedOptions(
                ["", ...categoryOptions],
                t
              )}
            />
          </FormGroup>
          {subcategoryOptions && subcategoryOptions.length > 0 && (
            <FormGroup label={t("Subcategory")}>
              <SelectInput
                value={props.event.subcategory}
                setValue={subcategory => props.updateEvent({ subcategory })}
                options={SelectInput.translatedOptions(
                  ["", ...subcategoryOptions],
                  t
                )}
              />
            </FormGroup>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
