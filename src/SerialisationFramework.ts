/////////////////////////////////////////
// SerialisationFramework
// Copyright (c) 2022 TXPCo Ltd
/////////////////////////////////////////


/// <summary>
/// Serialisable - root class for all derived types that can stream to and from JSON 
/// </summary>
export abstract class MSerialisable {

   constructor() {
   }

   abstract streamToJSON(): string;
   abstract streamFromJSON (stream: string) : void;
}

/*
   /// <summary>
   /// SerialisationFactory - base class for dynamic creation of derived classes
   /// Rules: 
   /// Class must have a default constructur.
   /// Class must include a static member SerialisationFactoryFor<AClass> (className)
   /// <summary>
   class MEDIA_API SerialisationFactory {

   public:

      // Constructors
      SerialisationFactory(const std::wstring_view className);
      virtual ~SerialisationFactory();

      // Attributes
      std::wstring_view className() const;

      static SerialisationFactory* findFactory(const std::wstring_view className);

   private:
#pragma warning (push)
#pragma warning (disable: 4251) // Member is private anyway      
      SerialisationFactory* m_pNext;
      std::wstring          m_className;  
#pragma warning (pop)
   };

  /// <summary>
  /// SerialisationFactoryFor - dynamic creation of derived classes
  /// <summary>
   template <class AClass> class SerialisationFactoryFor : public SerialisationFactory {

   public:

      // Constructors
      SerialisationFactoryFor(const std::wstring_view classNameIn) : SerialisationFactory(classNameIn) {}
      virtual ~SerialisationFactoryFor() {};

      AClass* create() {

         SerialisationFactoryFor *pFactory = static_cast<SerialisationFactoryFor *> (SerialisationFactory::findFactory(className()));

         if (pFactory) {
            return new AClass();
         }

         return nullptr;
      }

   private:

   };

*/