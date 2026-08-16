<script setup>
    import OverviewCard from '@/components/template/CoreDate/OverviewCard.vue';
    
</script>
<template>
    <!-- TODO: Implement a Breadcrump -->
    <div class="flex justify-items-center items-center w-full">
        <OverviewCard title="K&ouml;rperteile" path="/core-data/body-parts" urlText="Zu Körperteileverwaltung" />
        <OverviewCard title="&Uuml;bungen" path="/core-data/exercises" urlText="Zu &Uuml;bungsverwaltung" />
    </div>
    
</template>