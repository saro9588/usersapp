"use client";
import { Button, TextArea } from "@radix-ui/themes";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { note as NoteType } from "@prisma/client";

const NoteForm = ({ id, note }: { id: string; note: NoteType }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [noteState, setNoteState] = useState(note);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      if (note && note.id !== "") {
        await axios.patch(`/api/members/${note.id}`, {
          id: note.id,
          description: data.description,
        });
        setNoteState((prevNote) => ({
          ...prevNote,
          description: data.description,
        }));
      } else {
        const { data: newNote } = await axios.post(`/api/members/${id}/`, data);
        setNoteState(newNote);
      }
      router.push(`/members/${noteState.id || id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="max-w-xl" onSubmit={onSubmit}>
      <TextArea
        {...register("description", { required: "This is required." })}
        defaultValue={noteState?.description}
        placeholder="Take notes..."
      />
      <Button color="indigo" variant="soft" type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export const revalidate = 0;
export const dynamic = "force-dynamic";
export default NoteForm;
