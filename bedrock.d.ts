declare namespace Bedrock {
  interface System {
    /**
     * This is the first method that gets called immediately after the system is registered.
     */
    initialize: () => void;

    /**
     * This method gets called once every game tick.
     */
    update: () => void;

    /**
     * This method gets called when the Minecraft Script Engine is shutting down.
     */
    shutdown: () => void;

    /**
     * Creates an entity.
     * @param type Specifies the type of the entity that is being created by the template.
     * @param templateIdentifier This can be any of the entity identifiers from the applied Behavior Packs.
     */
    createEntity: (type?: 'entity' | 'item_entity', templateIdentifier?: string) => Bedrock.EntityObject | null;

    /**
     * Destroys an entity identified by the EntityObject
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     */
    destroyEntity: (entityObject: Bedrock.EntityObject) => true | null;

    /**
     * Checks if the given EntityObject corresponds to a valid entity.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     */
    isValidEntity: (entityObject: Bedrock.EntityObject) => boolean | null;

    /**
     * Creates a custom component that only exists in script. It can be then added, removed, and updated from entities. These custom components only exist while the Script Engine is running.
     * @param componentIdentifier The identifier of the custom component. It is required to use a namespace so you can uniquely refer to it later without overlapping a name with a built-in component.
     * @param componentData A JavaScript Object that defines the name of the fields and the data each field holds inside the component.
     */
    registerComponent: (componentIdentifier: string, componentData: {}) => true | null;

    /**
     * Creates the specified component and adds it to the entity. This should only be used with custom components which need to be registered first. If the entity already has the component, this will retrieve the component already there instead.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     * @param componentIdentifier The identifier of the component to add to the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
     */
    createComponent: (entityObject: Bedrock.EntityObject, componentIdentifier: string) => Component | null;

    /**
     * Checks if the given entity has the specified component.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     * @param componentIdentifier The identifier of the component to add to the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
     */
    hasComponent: (entityObject: Bedrock.EntityObject, componentIdentifier: string) => boolean | null;

    /**
     * Looks for the specified component in the entity. If it exists, retrieves the data from the component and returns it.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     * @param componentIdentifier The identifier of the component to add to the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
     */
    getComponent: (entityObject: Bedrock.EntityObject, componentIdentifier: string) => Component | null;

    /**
     * Applies the component and any changes made to it in script back to the entity. What this means for each component can be slightly different: it makes the component reload on the entity with the new data as if it had just been added to the entity.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     * @param componentObject The component object retrieved from the entity that was returned by either createComponent() or getComponent()
     */
    applyComponentChanges: (entityObject: Bedrock.EntityObject, componentObject: Component) => true | null;

    /**
     * Removes the specified component from the given entity. If the entity has the component, it will be removed. Currently this only works with custom components and can't be used to remove components defined for an entity in JSON.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event.
     * @param componentIdentifier The identifier of the component to add to the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
     */
    destroyComponent: (entityObject: Bedrock.EntityObject, componentIdentifier: string) => true | null;

    /**
     * Allows you to trigger an event with the desired data from script. Anything that signed up to listen for the event will be notified and the given data delivered to them.
     * @param eventIdentifier This is the identifier of the event we want to react to. Can be the identifier of a built-in event or a custom one from script.
     * @param eventData The data for the event. You can create a new JavaScript Object with the parameters you want to pass in to the listener and the engine will take care of delivering the data to them.
     */
    broadcastEvent: (eventIdentifier: string, eventData: any) => true | null;

    /**
     * Allows you to register a JavaScript object that gets called whenever the specified event is broadcast. The event can either be a built-in event or an event specified in script.
     * @param eventIdentifier This is the identifier of the event we want to react to. Can be the identifier of a built-in event or a custom one from script.
     * @param callbackObject The JavaScript object that will get called whenever the event is broadcast.
     */
    listenForEvent: (eventIdentifier: string, callbackObject: (eventData: any) => any) => true | null;

    /**
     * Allows you to register a query. A query will contain all entities that meet the filter requirement.
     * @param component This is the identifier of the component that will be used to filter entities.
     * @param componentField1 This is the name of the first field of the component that we want to filter entities by. By default this is set to x. If the component you used doesn't have the field you defined here, the field will be ignored.
     * @param componentField2 This is the name of the second field of the component that we want to filter entities by. By default this is set to y. If the component you used doesn't have the field you defined here, the field will be ignored.
     * @param componentField3 This is the name of the third field of the component that we want to filter entities by. By default this is set to z. If the component you used doesn't have the field you defined here, the field will be ignored.
     */
    registerQuery: (component?: string, componentField1?: string, componentField2?: string, componentField3?: string) => Bedrock.EntityObject | null;
    
    /**
     * By default no filters are added. This will allow queries to capture all entities.
     * @param query The object containing the ID of the query that you want to apply the filter to.
     * @param componentIdentifier This is the identifier of the component that will be added to the filter list. Only entities that have that component will be listed in the query.
     */
    addFilterToQuery: (query: {}, componentIdentifier: string) => void;

    /**
     * Allows you to fetch the entities captured by a query that was created with a component filter built-in. The only entities that will be returned are those entities that have the component that was defined when the query was registered and that have a value in the three fields on that component that were defined in the query within the values specified in the call to getEntitiesFromQuery.
     * @param query This is the query you registered earlier using registerQuery()
     * @param componentField1_Min The minimum value that the first component field needs to be on an entity for that entity to be included in the query.
     * @param componentField2_Min The minimum value that the second component field needs to be on an entity for that entity to be included in the query.
     * @param componentField3_Min The minimum value that the third component field needs to be on an entity for that entity to be included in the query.
     * @param componentField1_Max The maximum value that the first component field needs to be on an entity for that entity to be included in the query.
     * @param componentField2_Max The maximum value that the second component field needs to be on an entity for that entity to be included in the query.
     * @param componentField3_Max The maximum value that the third component field needs to be on an entity for that entity to be included in the query.
     */
    getEntitiesFromQuery: (
      query: {},
      componentField1_Min?: number,
      componentField2_Min?: number,
      componentField3_Min?: number,
      componentField1_Max?: number,
      componentField2_Max?: number,
      componentField3_Max?: number
    ) => EntityObject[] | null;
  }

  interface Component {
    /** READ ONLY. This is the identifier for the object in the format namespace:name. */
    __identifier__: string;

    /** READ ONLY. This defines the type of object we are using. */
    __type__: 'entity' | 'item_entity' | 'level' | 'component' | 'query';
  }

  interface EntityObject extends Bedrock.Component {
    /** READ ONLY. This is the unique identifier of the entity in the world. */
    id: number;
  }
}
